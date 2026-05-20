const imagekit = require("../config/imagekit");

const uploadImage = async (req, res) => {
    try {
        const {
            base64,
            fileName
        } = req.body;

        if (!base64 || !fileName) {
            return res.status(400).json({
                message: "Image data required"
            });
        }

        const result = await imagekit.upload({
            file: base64,
            fileName: `visitor_${Date.now()}_${fileName}`,
            folder: "/mygate/visitors"
        });

        res.status(200).json({
            url: result.url,
            fileId: result.fileId
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    uploadImage
};