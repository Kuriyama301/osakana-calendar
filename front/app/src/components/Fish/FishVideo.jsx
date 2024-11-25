import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { searchYoutubeVideos } from "../../api/youtube";

const FishVideo = ({ fishName }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!fishName) return;

      setIsLoading(true);
      setError(null);
      setIsCached(false);

      try {
        const data = await searchYoutubeVideos(fishName);
        setVideos(data);
        // キャッシュから取得した場合はローディング時間を短縮
        setIsLoading(false);
        setIsCached(true);
      } catch (err) {
        setError("動画の読み込みに失敗しました");
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [fishName]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">おすすめレシピ動画</h3>
        {isCached && (
          <span className="text-sm text-gray-500">キャッシュから読み込み</span>
        )}
      </div>

      {isLoading ? (
        <p className="text-center py-4">動画を読み込んでいます...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">{error}</p>
      ) : videos.length === 0 ? (
        <p className="text-center py-4">関連動画はありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow p-4">
              <h4 className="font-medium mb-2 line-clamp-2">{video.title}</h4>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="w-full h-full rounded"
                  allowFullScreen
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
