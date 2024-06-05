

const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

const validateImage = (extension) => {
    return validExtensions.includes(extension.toLowerCase());
};

module.exports = validateImage;