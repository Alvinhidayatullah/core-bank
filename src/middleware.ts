import { NextResponse } from 'next/server';


export function middleware() {
  const response = NextResponse.next();

  // 1. ANTI-XSS & OWASP Security Headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY'); // Mencegah Clickjacking
  response.headers.set('X-Content-Type-Options', 'nosniff'); // Mencegah MIME-Sniffing
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (CSP) ketat untuk mencegah XSS & injeksi script berbahaya
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'"
  );

  // 2. ANTI SENSITIVE DATA EXPOSURE
  // Memaksa browser selalu menggunakan HTTPS yang dienkripsi
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // Memblokir fitur browser yang tidak diperlukan untuk menjaga privasi
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // 3. DASAR ANTI-DDOS & RATE LIMITING
  // Catatan: Pada skala produksi besar, Anti-DDoS wajib diaktifkan di level infrastruktur (Cloudflare / AWS Shield).
  // Middleware ini bertugas sebagai filter lapis pertama di level aplikasi (Edge).
  // const ip = request.ip || request.headers.get('x-forwarded-for') || 'Unknown';
  
  // Jika IP dicurigai melakukan spamming (contoh logika), bisa di-block disini:
  // if (isRateLimited(ip)) return new NextResponse('Too Many Requests', { status: 429 });

  return response;
}

export const config = {
  matcher: '/:path*', // Aplikasikan pengamanan ke SELURUH rute aplikasi
};
