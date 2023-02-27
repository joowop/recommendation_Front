import React, { useEffect, useState } from "react";
import axios from "axios";
import getConfig from "next/config";
import style from "./recommendation_select.module.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TruckCardMob from "../../components/search/TruckCardMob";
import TruckCard from "../../components/search/TruckCard";
import Loading from "../../components/common/Loading";

export default function Recomendation_select() {
  const [params, setParams] = useState({
    A_main: "",
    B_item: "",
    C_pkg: "",
    D_ton: "",
    E_brand: "",
    F_reliability_q1: "",
    G_reliability_q2: "",
    H_reliability_q3: "",
    I_reliability_q4: "",
    J_reliability_q5: "",
    K_condition_q1: "",
    L_condition_q2: "",
    M_condition_q3: "",
    N_condition_q4: "",
    O_asset_q1: "",
    P_asset_q2: "",
    Q_asset_q3: "",
  });

  const { publicRuntimeConfig } = getConfig();
  const [recommendationData, setrecommendationData] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [answerKey, setAnswerKey] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [recommend, setrecommend] = useState([]);
  const [recommend_err, setrecommend_err] = useState([]);
  const [view, setview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getrecommendation = async () => {
    const url = `${publicRuntimeConfig.serverUrl}main/recommend`;
    const res = await axios.post(url, params);
    try {
      setQuestionType(res.data.type);
      setAnswerKey(res.data.answer_key);
      setrecommendationData(res.data.message);
      setview(res.data.view);
      setIsLoading(false);
      if (res.data.code == 200) {
        setrecommend(res.data.data);
      } else if ((res.data.code = 500)) {
        setrecommend(res.data.err);
        console.log(res.data.err);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getrecommendation();
    setIsLoading(true);
    console.log("params::::::::", params);
  }, [params]);

  return (
    <>
      <div className="compensation">
        <div className="pageTop">
          <div className="opacityFilm">
            <div className="contantCenter">
              <div className="leftTxt">
                <h1>차량 추천 시스템</h1>
              </div>
            </div>
          </div>
        </div>
        <div className={style.recContainer}>
          {questionType == "drop_down" ? (
            <div className={style.recInner}>
              <div className={style.recTitle}>{recommendationData}</div>
              <select
                value={"N"}
                className={style.recSelect}
                onChange={(e) => {
                  console.log("옵션값 변경 ::::", e.target.value);
                  setParams({ ...params, [answerKey]: e.target.value });
                }}
              >
                <option value={"N"} className={style.recSelect}>
                  보기
                </option>
                {Object.entries(view).map(([key, value]) => {
                  return (
                    <option key={key} value={value}>
                      {key}
                    </option>
                  );
                })}
              </select>
              {isLoading && (
                <div className={style.recview}>
                  <strong>추천 차량을 준비 중입니다...</strong>
                  <Loading />
                </div>
              )}
            </div>
          ) : (
            <div className={style.recWrapper}>
              <div className={style.recTitleWrapper}>
                <div className={style.recomTitle}>추천 차량</div>
              </div>

              <div className={style.recContent}>
                {recommend && recommend.length > 0 ? (
                  !isMobile ? (
                    recommend.map((truckDetail, i) => {
                      return <TruckCard key={i} truckDetail={truckDetail} />;
                    })
                  ) : (
                    recommend.map((truckDetail, i) => {
                      return <TruckCardMob key={i} truckDetail={truckDetail} />;
                    })
                  )
                ) : (
                  <div>추천차량 매물이 없습니다.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
