import {
	FaFacebookF,
	FaInstagram,
	FaTiktok,
	FaTwitter,
} from "react-icons/fa6";

const SocialMedia = () => {
	return (
		<section className="flex-col mt-5 gap-2 pt-0 flex items-center">
			<h2 className="text-[10px] font-bold text-black uppercase tracking-wide">
				Follow us
			</h2>
			<nav aria-label="Social media" className="gap-5 flex items-center">
				<a
					href="#facebook"
					aria-label="Facebook"
					className="text-[17px] text-[#1877f2] transition-transform hover:scale-110"
				>
					<FaFacebookF />
				</a>
				<a
					href="#tiktok"
					aria-label="TikTok"
					className="text-[17px] text-black transition-transform hover:scale-110"
				>
					<FaTiktok />
				</a>
				<a
					href="#instagram"
					aria-label="Instagram"
					className="text-[18px] text-[#e1306c] transition-transform hover:scale-110"
				>
					<FaInstagram />
				</a>
				<a
					href="#twitter"
					aria-label="Twitter"
					className="text-[17px] text-[#1da1f2] transition-transform hover:scale-110"
				>
					<FaTwitter />
				</a>
			</nav>
		</section>
	);
};

export default SocialMedia;
