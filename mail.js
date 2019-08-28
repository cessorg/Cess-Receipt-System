const nodemailer =require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: "email",
        clientId: "id",
        clientSecret: "secret key",
        refreshToken: "token",
        accessToken: "token",
        expires: 1234
    }
});

module.exports=function(mailOptions){
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
    });
}
