const validIamgeExtensions = ['png', 'jpg', 'jpeg', 'gif'];
const validSongExtensions = ['mp3', 'ogg'];

const validateImage = (extension) => {
    return validIamgeExtensions.includes(extension.toLowerCase());
};

const validateSong = (extension) => {
    return validSongExtensions.includes(extension.toLowerCase());
};

module.exports = {
    validateImage,
    validateSong
};