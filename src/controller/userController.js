import User from '../model/user.js';
import bcrypt from 'bcrypt';

/**
 * render register form
 * @param {object} req - request object
 * @param {object} res - response object
 */
export const registerForm = (req, res) => {
  res.render('users/register')
}

/**
 * handle register
 * @param {object} req - request object
 * @param {object} res - response object
 */
export const handleRegister = async (req, res) => {
  const { username, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10) // Hash the password

    // Create and save the new user
    const newUser = new User({
      username,
      password: hashedPassword
    })
    await newUser.save()
    req.flash('success', 'Registration successful!')
    req.session.user = { _id: newUser._id.toString(), username: newUser.username }
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err)
        req.flash('error', 'An error occurred during registration.')
        return res.redirect('/users/register')
      }
      res.redirect('/')
    })
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error, username already exists
      req.flash('error', 'Username is already taken.')
      res.status(409).redirect('/users/register')
    } else {
      req.flash('error', 'An error occurred during registration.')
      res.satus(500).redirect('/users/register')
    }
  }
}

/**
 * render login form
 * @param {object} req - request object
 * @param {object} res - response object
 */
export const loginForm = (req, res) => {
  res.render('users/login')
}

/**
 * handle login
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {Promise} - promise
 */
export const handleLogin = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (user && await bcrypt.compare(password, user.password)) {
      // Store only necessary information in the session
      req.session.user = {
        _id: user._id,
        username: user.username
      }

      // Explicitly save the session before redirecting
      req.session.save(err => {
        if (err) {
          console.error('Session save error:', err)
          req.flash('error', 'An error occurred during login.')
          return res.redirect('/users/login')
        }

        const redirectUrl = req.session.orignalUrl || '/';
        delete req.session.orignalUrl;
        return res.redirect(redirectUrl)

      })
    } else {
      req.flash('error', 'Invalid username or passWord')
      res.redirect('/users/login')
    }
  } catch (error) {
    console.error('Login error:', error)
    req.flash('error', 'An error occurred during login.')
    res.redirect('/users/login')
  }
}

/**
 * logout
 * @param {object} req - request object
 * @param {object} res - response object
 */
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/users/login')
  })
}
