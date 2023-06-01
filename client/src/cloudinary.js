import { Cloudinary } from "@cloudinary/url-gen";

const name = "ddo9nnseq";
const uploadUrl = `https://api.cloudinary.com/v1_1/${name}/image/upload`;

const cloudinary = new Cloudinary({
    cloud: {
        cloud_name: name,
    },
});

export default cloudinary;
export { name, uploadUrl };
