export default function VideoCard({ title }) {
  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">

      <div className="bg-black h-96 flex items-center justify-center text-white">
        Video Placeholder
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-gray-500 text-sm">@creator</p>

        <div className="flex gap-4 mt-3 text-gray-600">
          ❤️ 120
          💬 20
          🔁 10
        </div>
      </div>

    </div>
  )
}