/**
* 旬の期間表示のコンポーネント
* 魚の旬の開始月(上中下旬)と終了月(上中下旬)を表示する
*/

import PropTypes from "prop-types";

const SeasonTerm = ({ season }) => {
  const getSeasonTerm = (day) => {
    if (day <= 10) return "上旬";
    if (day <= 20) return "中旬";
    return "下旬";
  };

  if (
    !season ||
    !season.start_month ||
    !season.start_day ||
    !season.end_month ||
    !season.end_day
  ) {
    return <span className="text-sm text-gray-600">期間データなし</span>;
  }

  const startTerm = getSeasonTerm(season.start_day);
  const endTerm = getSeasonTerm(season.end_day);

  return (
    <span className="text-sm text-gray-600">
      {`${season.start_month}月${startTerm}～${season.end_month}月${endTerm}`}
    </span>
  );
};

SeasonTerm.propTypes = {
  season: PropTypes.shape({
    start_month: PropTypes.number,
    start_day: PropTypes.number,
    end_month: PropTypes.number,
    end_day: PropTypes.number,
  }),
};

export default SeasonTerm;
