import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const authController = {
  loginUser: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).send(info.message);
      
      req.login(user, (err) => {
        if (err) return next(err);
        res.send('Logged in successfully');
      });
    })(req, res, next);
  },

  logoutUser: (req, res) => {
    req.logout((err) => {
      if (err) return next(err);
      res.send('Logged out');
    });
  },

  checkAuth: (req, res) => {
    if (req.isAuthenticated()) {
      res.send({ authenticated: true, user: req.user });
    } else {
      res.send({ authenticated: false });
    }
  },
};

export default authController;
