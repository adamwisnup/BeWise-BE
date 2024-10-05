const InformationRepository = require("../repositories/information");
const imagekit = require("../../../libs/imagekit");
const path = require("path");

class InformationService {
  async createInformation(title, content, image) {
    if (!title) {
      throw new Error("Title tidak boleh kosong");
    }

    if (!content) {
      throw new Error("Content tidak boleh kosong");
    }

    if (!image || !image.buffer) {
      throw new Error("Image tidak boleh kosong");
    }

    const fileBase64 = image.buffer.toString("base64");

    const response = await imagekit.upload({
      fileName: Date.now() + path.extname(image.originalname),
      file: fileBase64,
      folder: "BeWise/Informations",
    });

    const information = await InformationRepository.createInformation({
      title,
      content,
      image: response.url,
    });

    return { information };
  }

  async findAllInformation(page = 1, limit = 10) {
    const informations = await InformationRepository.findAllInformation(
      page,
      limit
    );

    return informations;
  }

  async findInformationById(informationId) {
    const information = await InformationRepository.findInformationById(
      informationId
    );

    if (!information) {
      const error = new Error("Informasi tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return information;
  }

  async updateInformation(informationId, data) {
    const { title, content, image } = data;

    const existingInformation = await InformationRepository.findInformationById(
      informationId
    );
    if (!existingInformation) {
      const error = new Error("Informasi tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    let updatedData = {
      title: title || existingInformation.title,
      content: content || existingInformation.content,
      image: existingInformation.image,
    };

    if (image && image.buffer) {
      const fileBase64 = image.buffer.toString("base64");
      const response = await imagekit.upload({
        fileName: Date.now() + path.extname(image.originalname),
        file: fileBase64,
        folder: "BeWise/Informations",
      });
      updatedData.image = response.url;
    }

    const updatedInformation = await InformationRepository.updateInformation(
      informationId,
      updatedData
    );

    return updatedInformation;
  }

  async deleteInformation(informationId) {
    const existingInformation = await InformationRepository.findInformationById(
      informationId
    );

    if (!existingInformation) {
      const error = new Error("Informasi tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    const deletedInformation = await InformationRepository.deleteInformation(
      informationId
    );

    return deletedInformation;
  }
}

module.exports = new InformationService();
