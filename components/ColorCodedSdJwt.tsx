const sectionColors = {
  header: "text-red-500",
  payload: "text-green-500",
  signature: "text-blue-500",
  digestColors: [
    "text-purple-500",
    "text-yellow-500",
    "text-pink-500",
    "text-teal-500",
  ],
};

const ColorCodedSdJwt: React.FC<{ sdJwt: string }> = ({ sdJwt }) => {
  const [header, payload, signature, ...digests] = sdJwt
    .split("~")
    .join(".")
    .split(".");

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="text-l font-bold mb-2">Issuer's SD-JWT</h3>
      <div className="break-all">
        {/* Header */}
        <span className={sectionColors.header}>{header}</span>
        <span className="text-gray-400">.</span>

        {/* Payload */}
        <span className={sectionColors.payload}>{payload}</span>
        <span className="text-gray-400">.</span>

        {/* Signature */}
        <span className={sectionColors.signature}>{signature}</span>

        {/* Digests */}
        {digests.map((digest, index) => (
          <div key={index} className="inline-block">
            <span className="text-gray-400">~</span>
            <span
              className={
                sectionColors.digestColors[
                  index % sectionColors.digestColors.length
                ]
              }
            >
              {digest}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorCodedSdJwt;
