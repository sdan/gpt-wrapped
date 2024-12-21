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
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            ChatGPT Wrapped
          </h1>
          <p className="text-xl text-gray-300">End 2024 with a GPT Wrapper</p>
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
