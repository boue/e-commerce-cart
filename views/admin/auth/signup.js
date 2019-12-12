const layout = require('../layout')

const getError = (errors, prop) => {
    // prop === 'email' || 'password' || 'passwordConfirmation'
    //Errors is an array     
    //    errors:
    //    [ { value: 'cmcmc',
    //        msg: 'Passwords must match',
    //        param: 'passwordConfirmation',
    //        location: 'body' } ] }
    try {
        return errors.mapped()[prop].msg
        // so here errors.mapped returns object up top
        // just the specific property msg we are looking for
    } catch (err) {
        // we are trying to catch an error that doesnt exist
        return ''
    }
}

module.exports = ({
    req,
    errors
}) => {
    return layout({
        content: `
            <div>
                Your id is: ${req.session.userId}
                <form method="POST">
                    <input name="email" placeholder="email" />
                    ${getError(errors, 'email')}
                    <input name="password" placeholder="password" />
                    ${getError(errors, 'password')}
                    <input name="passwordConfirmation" placeholder="password confirmation" />
                    ${getError(errors, 'passwordConfirmation')}
                    <button>Sign Up</button>
                </form>
            </div>
        `
    })
}