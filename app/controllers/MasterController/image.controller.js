const Images = require('../../models/master/Images')
const validate = require('../../validators/image.validator')
const bcrypt = require('bcrypt');

const config = require('../../utils/config')

const AZURE_CONNECTION = process.env.AZURE_CONNECTION
const azureStorage = require('azure-storage')
const blobService = azureStorage.createBlobService(AZURE_CONNECTION)

const getStream = require('into-stream')
const containerName = process.env.CONTAINER_NAME

const uuid = require('uuid');


/**
 * @class - Image class containing all the controllers
 */

const handleError = (err, res) => {
    res.status(500).send({ error: err });
};

const getBlobName = (originalName) => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

class Image {



    async getImage(req, res) {
        let tag = req.params.id;
        let image = await Images.find({ tags: tag }).lean()
        if (!image) {
            return res.status(404).send({ message: "no image found" })
        }
        image = image.map(x => {

            let accountName = config.getStorageAccountName()
            let container = containerName

            x.url = `https://${accountName}.blob.core.windows.net/${container}/${x.orignalName}`
            return x
        })

        res.status(200).send({
            status: true,
            images: image,
        });

    }



    async createImage(req, res) {
        // console.log(req.file)


        if (req.body.tags) {
            req.body.tags = JSON.parse(req.body.tags)
        }
        let { error } = validate.validateImage(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        const blobName = getBlobName(req.file.originalname)
        const stream = getStream(req.file.buffer)
        const streamLength = req.file.buffer.length


        let image = new Images({
            filename: req.file.originalname,
            orignalName: blobName,
            tags: req.body.tags.map(x => x.tag),
            userId: req.user._id
        })

        console.log(containerName, "container");


        blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {

            if (err) {
                handleError(err, res);
                return;
            }
            image.save()


            res.status(200).send({
                message: 'Image uploaded .'
            });
        });



    }




}

module.exports = Image;
