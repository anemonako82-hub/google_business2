import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const keywords = formData.get('keywords') as string;
    const notes = formData.get('notes') as string;
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: '画像が見つかりません。' }, { status: 400 });
    }

    // 画像ファイルをバイナリ（生データ）に変換
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🌟Makeが100%「ファイル」としてキャッチできるよう、標準的なFormDataを再構築
    const sendFormData = new FormData();
    sendFormData.append('keywords', keywords || '');
    sendFormData.append('notes', notes || '');
    
    // Blob（塊）にしてファイル名とMIMEタイプを正確にセット
    const blob = new Blob([buffer], { type: imageFile.type });
    sendFormData.append('image', blob, imageFile.name);

    // MakeのWebhook URL
    const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/idkvilffjvvg9hjjze88cvvvqv94j461';

    // 送信（FormDataで送ることで、数MBの画像も絶対に削られずにそのまま届きます）
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      body: sendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Makeへの送信エラー: ${errorText}` }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}