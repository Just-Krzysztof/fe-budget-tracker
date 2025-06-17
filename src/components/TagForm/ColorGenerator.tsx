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
  const presetColors = [
    { name: 'Blue', bg: '#3b82f6', text: '#ffffff' },
    { name: 'Green', bg: '#10b981', text: '#ffffff' },
    { name: 'Red', bg: '#ef4444', text: '#ffffff' },
    { name: 'Purple', bg: '#8b5cf6', text: '#ffffff' },
    { name: 'Orange', bg: '#f97316', text: '#ffffff' },
    { name: 'Gray', bg: '#6b7280', text: '#ffffff' },
  ];

  const randomColors = [
    { bg: '#3b82f6', text: '#ffffff' },
    { bg: '#10b981', text: '#ffffff' },
    { bg: '#ef4444', text: '#ffffff' },
    { bg: '#8b5cf6', text: '#ffffff' },
    { bg: '#f97316', text: '#ffffff' },
    { bg: '#06b6d4', text: '#ffffff' },
    { bg: '#84cc16', text: '#ffffff' },
    { bg: '#f59e0b', text: '#ffffff' },
    { bg: '#ec4899', text: '#ffffff' },
    { bg: '#6366f1', text: '#ffffff' },
  ];

  const generateRandomColor = () => {
    const randomColor =
      randomColors[Math.floor(Math.random() * randomColors.length)];
    onColorChange(randomColor.bg, randomColor.text);
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
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
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
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="#ffffff"
              value={colorText || ''}
              onChange={(e) => onColorChange(colorBg, e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Color Generator Buttons */}
      <div className="flex gap-2 flex-wrap">
        {presetColors.map((color) => (
          <button
            key={color.name}
            type="button"
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onColorChange(color.bg, color.text)}
          >
            {color.name}
          </button>
        ))}
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
