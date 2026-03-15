export default function Upload() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Upload Video</h1>

      <input type="file" className="border p-2"/>
      <button className="block mt-3 bg-black text-white px-4 py-2">
        Upload
      </button>
    </div>
  )
}