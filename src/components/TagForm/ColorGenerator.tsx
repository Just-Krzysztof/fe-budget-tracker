interface ColorGeneratorProps {
  colorBg: string;
  colorText: string;
  onColorChange: (bg: string, text: string) => void;
}

export const ColorGenerator = ({
  colorBg,
  colorText,
  onColorChange,
}: ColorGeneratorProps) => {

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const bgColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    const textColor = brightness > 128 ? '#000000' : '#ffffff';

    onColorChange(bgColor, textColor);
  };

  return (
    <div className="space-y-3">
      <label className="block text-gray-600 text-sm font-bold mb-2">
        Colors
      </label>

      {/* Color Controls */}
      <div className="grid grid-cols-2 gap-3">
        {/* Background Color */}
        <div>
          <label className="block text-gray-600 text-xs font-bold mb-1">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              value={colorBg || '#3b82f6'}
              onChange={(e) => onColorChange(e.target.value, colorText)}
            />
            <input
              type="text"
              className="flex-1 px-2 py-1 text-xs input bg-gray-100 focus:outline-none"
              placeholder="#3b82f6"
              value={colorBg || ''}
              onChange={(e) => onColorChange(e.target.value, colorText)}
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-gray-600 text-xs font-bold mb-1">
            Text Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              value={colorText || '#ffffff'}
              onChange={(e) => onColorChange(colorBg, e.target.value)}
            />
            <input
              type="text"
              className="flex-1 px-2 py-1 text-xs input bg-gray-100 focus:outline-none"
              placeholder="#ffffff"
              value={colorText || ''}
              onChange={(e) => onColorChange(colorBg, e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Random Color Generator */}
      <button
        type="button"
        className="w-full px-3 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600"
        onClick={generateRandomColor}
      >
        🎨 Generate Random Color
      </button>
    </div>
  );
};
