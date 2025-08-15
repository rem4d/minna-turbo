export default function ErrorFallbackComponent() {
  return (
    <div className="bg-athens-gray relative h-screen w-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black">
        Unexpected error has occurred. <br />
        Please refresh page.
      </div>
    </div>
  );
}
