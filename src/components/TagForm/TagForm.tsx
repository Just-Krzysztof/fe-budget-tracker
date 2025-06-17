import { Input } from '../Form/Input';
import { Submit } from '../Form/Submit';
import { TagPreview } from './TagPreview';
import { ColorGenerator } from './ColorGenerator';

interface TagFormData {
  tagName: string;
  colorBg: string;
  colorText: string;
}

interface TagFormProps {
  formData: TagFormData;
  onFormDataChange: (data: TagFormData) => void;
  onSubmit: (data: TagFormData) => void;
}

export const TagForm = ({
  formData,
  onFormDataChange,
  onSubmit,
}: TagFormProps) => {
  const handleColorChange = (bg: string, text: string) => {
    onFormDataChange({
      ...formData,
      colorBg: bg,
      colorText: text,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-4 p-2">
      <Input
        inputName="tagName"
        inputType="text"
        label="Tag Name"
        placeholder="Enter tag name..."
        required
        onChange={(e) =>
          onFormDataChange({
            ...formData,
            tagName: e.target.value,
          })
        }
      />

      <TagPreview
        tagName={formData.tagName}
        colorBg={formData.colorBg}
        colorText={formData.colorText}
      />

      <ColorGenerator
        colorBg={formData.colorBg}
        colorText={formData.colorText}
        onColorChange={handleColorChange}
      />

      <Submit
        className="mx-auto"
        type="button"
        name="Create Tag"
        disabled={!formData.tagName || !formData.colorBg || !formData.colorText}
        onClick={handleSubmit}
      />
    </div>
  );
};
