import { Link } from "react-router-dom";

export const SocialLinks = () => {
  return (
    <div className="pt-4 border-t border-white/20 mt-auto">
      <div className="flex gap-4">
        <Link to="#" className="text-white/60 hover:text-white">
          Facebook
        </Link>
        <Link to="#" className="text-white/60 hover:text-white">
          Twitter
        </Link>
        <Link to="#" className="text-white/60 hover:text-white">
          Google
        </Link>
      </div>
    </div>
  );
};