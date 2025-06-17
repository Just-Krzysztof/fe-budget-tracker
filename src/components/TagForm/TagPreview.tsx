interface TagPreviewProps {
  tagName: string;
  colorBg: string;
  colorText: string;
}

export const TagPreview = ({
  tagName,
  colorBg,
  colorText,
}: TagPreviewProps) => {
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
      <span className="text-sm font-medium">Preview:</span>
      <span
        className="px-3 py-1 rounded-full text-sm font-medium"
        style={{
          backgroundColor: colorBg || '#3b82f6',
          color: colorText || '#ffffff',
        }}
      >
        {tagName || 'Sample Tag'}
      </span>
    </div>
  );
};
