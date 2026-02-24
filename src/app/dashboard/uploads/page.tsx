import { UploadForm } from '@/components/dashboard/UploadForm';

export default function UploadsPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-bold mb-6">
        Upload Work
      </h1>
      <UploadForm />
    </div>
  );
}
