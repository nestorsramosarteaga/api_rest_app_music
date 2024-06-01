// testing
const testing = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Message sent from artist controller"
    });
}
// export
module.exports = {
    testing
}