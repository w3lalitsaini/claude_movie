"use client";
import { useState } from "react";
import { FiStar } from "react-icons/fi";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  max?: number;
  size?: number;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, max = 10, size = 16, readonly = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const stars = max === 10 ? 5 : max;
  const scale = max / stars;

  const getStarFill = (star: number) => {
    const effective = hovered || value;
    const scaledVal = effective / scale;
    if (star <= Math.floor(scaledVal)) return 1;
    if (star === Math.ceil(scaledVal)) return scaledVal - Math.floor(scaledVal);
    return 0;
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: stars }, (_, i) => i + 1).map((star) => {
        const fill = getStarFill(star);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star * scale)}
            onMouseEnter={() => !readonly && setHovered(star * scale)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`relative ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          >
            <FiStar size={size} className="text-[#333]" fill="#333" />
            {fill > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <FiStar size={size} className="text-[#fbbf24]" fill="#fbbf24" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
