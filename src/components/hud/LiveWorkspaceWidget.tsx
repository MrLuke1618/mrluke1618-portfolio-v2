import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Loader2, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Thermometer, Youtube, Music, Tv, Radio } from 'lucide-react';
import { Language } from '../../types';

interface LiveWorkspaceWidgetProps {
  language: Language;
}

export const LiveWorkspaceWidget: React.FC<LiveWorkspaceWidgetProps> = ({ language }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Hanoi coordinates
  const locationInfo = {
    city: 'Hanoi',
    country: 'Vietnam',
    latitude: 21.0285,
    longitude: 105.8542
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.latitude}&longitude=${locationInfo.longitude}&current=temperature_2m,weather_code`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.current) {
            setWeather({
              temp: Math.round(data.current.temperature_2m),
              code: data.current.weather_code
            });
          }
        }
      } catch {
        // Silently handle
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [locationInfo.latitude, locationInfo.longitude]);

  const getWeatherDetails = (code: number, lang: Language) => {
    if (code === 0) return { icon: Sun, text: lang === 'en' ? 'Clear Sky' : 'Trời quang' };
    if (code >= 1 && code <= 3) return { icon: Cloud, text: lang === 'en' ? 'Partly Cloudy' : 'Nhiều mây' };
    if (code === 45 || code === 48) return { icon: Cloud, text: lang === 'en' ? 'Foggy' : 'Có sương mù' };
    if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return { icon: CloudRain, text: lang === 'en' ? 'Rainy' : 'Có mưa' };
    if (code >= 71 && code <= 75) return { icon: CloudSnow, text: lang === 'en' ? 'Snowy' : 'Có tuyết' };
    if (code >= 95 && code <= 99) return { icon: CloudLightning, text: lang === 'en' ? 'Thunderstorm' : 'Có dông bão' };
    return { icon: Cloud, text: lang === 'en' ? 'Cloudy' : 'Nhiều mây' };
  };

  const formattedTime = time.toLocaleTimeString(language === 'en' ? 'en-US' : 'vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Bangkok'
  });

  const formattedDate = time.toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Bangkok'
  });

  return (
    <div className="rounded-2xl bg-[#131B2E] border border-[#1E293B] p-5 shadow-xl text-xs space-y-4 font-mono relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
        <span className="font-semibold text-[#F8FAFC] tracking-tight flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[#8B5CF6]" />
          {language === 'en' ? 'WORKSPACE SENSORS' : 'CẢM BIẾN LÀM VIỆC'}
        </span>
        <span className="text-[11px] text-[#8B5CF6]">
          UTC+7 HANOI
        </span>
      </div>

      {/* Clock display */}
      <div className="space-y-1">
        <div className="text-2xl font-bold tracking-tight text-[#F8FAFC] tabular-nums">
          {formattedTime}
        </div>
        <div className="text-xs text-[#94A3B8]">{formattedDate}</div>
        <div className="text-[10px] text-[#94A3B8]">TIMEZONE: ASIA/BANGKOK</div>
      </div>

      {/* Live Weather Widget */}
      <div className="border-t border-[#1E293B] pt-3">
        <div className="text-[#94A3B8] flex items-center gap-1.5 mb-2">
          <Thermometer className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>{language === 'en' ? 'Hanoi Weather' : 'Thời tiết Hà Nội'}</span>
        </div>
        {loadingWeather ? (
          <div className="flex items-center gap-2 text-[#94A3B8] py-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
            <span>{language === 'en' ? 'Syncing...' : 'Đang cập nhật...'}</span>
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#090D16] border border-[#1E293B] text-[#F8FAFC]">
            <div className="flex items-center gap-2">
              {React.createElement(getWeatherDetails(weather.code, language).icon, { className: "w-4 h-4 text-[#8B5CF6]" })}
              <span>{getWeatherDetails(weather.code, language).text}</span>
            </div>
            <span className="text-[#F8FAFC] font-bold tabular-nums">{weather.temp}°C</span>
          </div>
        ) : (
          <div className="text-[#94A3B8] italic">{language === 'en' ? 'Unavailable' : 'Không có dữ liệu'}</div>
        )}
      </div>

      {/* Location & Map Radar */}
      <div className="border-t border-[#1E293B] pt-3 space-y-2">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-[#F8FAFC]">Hanoi, Vietnam</span>
          </div>
          <span className="text-[10px]">21.0285° N, 105.8542° E</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#1E293B]">
          <iframe
            title="Hanoi Location Map"
            src="https://maps.google.com/maps?q=Hanoi%20Vietnam&z=12&output=embed"
            className="w-full h-28 opacity-80 hover:opacity-100 transition-opacity"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(25%) contrast(110%)' }}
            allowFullScreen={false}
            loading="lazy"
          />
        </div>
      </div>

      {/* Fast Channels */}
      <div className="border-t border-[#1E293B] pt-3">
        <div className="text-[#94A3B8] flex items-center gap-1.5 mb-2">
          <Compass className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>{language === 'en' ? 'Quick Channels' : 'Kênh liên kết'}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <a
            href="https://youtube.com/@luke1618gamer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] transition-all text-center"
          >
            <Youtube className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-[10px] text-[#94A3B8]">YouTube</span>
          </a>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] transition-all text-center"
          >
            <Music className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-[10px] text-[#94A3B8]">Spotify</span>
          </a>
          <a
            href="https://netflix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] transition-all text-center"
          >
            <Tv className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-[10px] text-[#94A3B8]">Netflix</span>
          </a>
        </div>
      </div>
    </div>
  );
};
