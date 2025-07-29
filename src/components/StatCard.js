const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow flex flex-col">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default StatCard;