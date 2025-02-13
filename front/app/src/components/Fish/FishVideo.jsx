/**
* 魚の詳細情報のモーダルコンポーネント
* バックエンドのAPIから取得した魚のデータ(画像、旬の季節、原産地、栄養、特徴)と
* YouTube動画を表示する
*/

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { searchYoutubeVideos } from "../../api/youtube";

const FishVideo = ({ fishName }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!fishName) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchYoutubeVideos(fishName);
        setVideos(data);
      } catch (err) {
        setError("動画の読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [fishName]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">おすすめレシピ動画</h3>

      {isLoading ? (
        <p className="text-center py-4">動画を読み込んでいます...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">{error}</p>
      ) : videos.length === 0 ? (
        <p className="text-center py-4">関連動画はありません</p>
      ) : (
        <div className="space-y-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow p-4">
              <h4 className="font-medium mb-2 line-clamp-2">{video.title}</h4>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="w-full h-full rounded"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FishVideo.propTypes = {
  fishName: PropTypes.string.isRequired,
};

export default FishVideo;
