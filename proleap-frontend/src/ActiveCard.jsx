/**
 * Return information relevant to the poll. If no session is live, no information is sent.
 * @param {boolean} isActive - ongoing session details
 */
export function ActiveCard({ isActive }) {
  return (
    <div className="flex justify-center items-center bg-gray-200 p-5 h-full min-w-full rounded-xl">
      {isActive ? (
        <label className="text-2xl font-sans">
          {"Poll is active! Loading polls..."}
        </label>
      ) : (
        <label className="text-2xl font-sans">{"Poll is not active. "}</label>
      )}
    </div>
  );
}
