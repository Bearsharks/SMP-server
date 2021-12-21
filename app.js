const express = require('express');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const wrap = require('./asyncWrap');
const { GOOGLE_SCOPES } = require('./util');
const googleOAuth = require('./googleOAuth');
const app = express();
//MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new fileStore()
}));
/*
생각해보니 엑세스토큰을 웹앱으로 넘겨서 거기서 알아서 처리하도록하고 
여기서는 만료되었을때 새로운 엑세스토큰갱신해서 넘겨주고
새로운 권한 필요할때 리다이렉트시켜주기만 하면되는거아님?
*/
app.get('/', (req, res) => {
    const temp = getPage('Welcome', 'Welcome to visit...', getBtn(req.session.userInfo));
    res.send(temp);
});

//구글 로그인 버튼 클릭시 구글 페이지로 이동하는 역할
app.get('/auth/google', (req, res) => {
    res.redirect(googleOAuth.getAuthorizeUrl(GOOGLE_SCOPES));
});
app.get('/oauth2/callback', (req, res) => {
    // acquire the code from the querystring, and close the web server.
    const code = req.query.code;
    googleOAuth.authenticate(code, req)
        .then((userinfo) => {
            //세션에 저장
            req.session.userInfo = userinfo;
            res.redirect(req.session.cookie.path);
        })
        .catch((err) => {
            console.error(err);
            res.redirect('/');
        });
})
//로그인 or 로그아웃 상태에 따른 버튼 생성
const getBtn = (user) => {
    return user ? `${user.name} | <a href="/auth/logout">logout</a>` : `<a href="/auth/google">Google Login</a>`;
}

app.get('/auth/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) next(err);
        res.cookie(`connect.sid`, ``, { maxAge: 0 });
        res.redirect('/');
    });
});


//페이지 생성 함수
const getPage = (title, description, auth) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body>
            ${auth}
            <h1>${title}</h1>
            <p>${description}</p>
        </body>
        </html>
        `;
}


//SERVER
app.listen(3000, () => console.log('http://localhost:3000'));

