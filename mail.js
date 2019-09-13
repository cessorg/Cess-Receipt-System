const nodemailer =require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: "manjotsingh16july@gmail.com",
      clientId: "825656477336-78d1p99vljedfpm2bv181ntd1b1obta7.apps.googleusercontent.com",
      clientSecret: "gRedgJh5F_nZjI0i_j6BgR84",
      refreshToken: "1/ajJoXfqaj-3xkDxJzJDS2mdzDoO5vx4x4ax_OywuYY9TPqSPPBYcA1LaaVQ5P-ch",
      accessToken: "ya29.GlvNBvjBJsFkOlstDauW45RYYEPEw270ZpwLhyWFlDEFEqwFNgPx9GPoWjmPuEOsrOCbXuXwon6y-rDD2cjIK7uWw9LhHaaOpTYrxJ4w11ATrSeEj-R4JK0LJRkh",
      expires: 1484314697598
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
