import GbpPostForm from '@/components/GbpPostForm';

export default function AdminGbpPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      {/* 上で作ったフォーム部品をここで呼び出して表示する */}
      <GbpPostForm />
    </main>
  );
}