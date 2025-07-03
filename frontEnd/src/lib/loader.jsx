
import { BounceLoader } from "react-spinners";

export default function Loader({ loading }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <BounceLoader color="#7f22fe" loading={loading} size={100} />
    </div>
  );
}
