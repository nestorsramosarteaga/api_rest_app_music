// testing
const testing = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Message sent from song controller"
    });
}
// export
module.exports = {
    testing
}