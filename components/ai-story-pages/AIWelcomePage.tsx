import Image from "next/image";

export default function AIWelcomePage() {
  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 relative">
        <Image
          src="/descending/top.png"
          alt="Top decorative pattern"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover"
          priority
        />
      </div>
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center relative z-10 w-full space-y-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            ChatGPT Wrapped
          </h1>
          <p className="text-xl text-gray-400">End 2024 with a GPT Wrapper</p>
        </div>
      </div>
      <div className="w-full h-1/4 relative">
        <Image
          src="/descending/bottom.png"
          alt="Bottom image"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
