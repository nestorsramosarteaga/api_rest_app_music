

const validIamgeExtensions = ['png', 'jpg', 'jpeg', 'gif'];

const validateImage = (extension) => {
    return validIamgeExtensions.includes(extension.toLowerCase());
};

module.exports = validateImage;