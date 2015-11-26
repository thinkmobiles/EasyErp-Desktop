/**
 * Created by Taras on 25.11.2015.
 */

var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');

module.exports = function ( models, event) {
    var handler = new UserHandler( models, event);
    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/localhost:port/user/login`
     *
     * This __method__ allows to login.
     * @example {
         *     dbId: "CRM",
         *     login: "Alex"
         *     pass: "777777"
         * }
     * @method login
     * @property {JSON} Object - Object with data for logining (like in example)
     * @for user
     * @memberOf user
     * @instance
     */

    router.post('/login', handler.login);

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/localhost:port/user/`
     *
     *
     *
     * This __method__ return list of users profile.
     *
     *
     * * __Request:__
     *
     *   Query:
     *      count // (Iteger) total position in list
     *      page // number of page
     *
     *
     * ___`/user/?page=1&count=10`___
     *
     *
     * __Responses:__
     *
     *      status (200) JSON Object: {"data":[Array of objects]}
     *      status (400, 500) JSON object: {error: 'Text about error'} or {error: object}
     *
     *
     * @method /
     * @for user
     * @memberOf user
     * @instance
     */

    router.get('/', handler.getUser);//Users route
    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/localhost:port/user/:id`
     *
     *
     *
     * This __method__ return one user profile.
     *
     *
     * * __Request:__
     *
     *   Params:
     *
     *   id - Object ID
     *
     *   if need current user
     *   id - 'current'
     *
     *
     *
     * ___`/user/560c099da5d4a2e20ba5068b`___
     *
     * ___`/user/current`___
     *
     *
     * __Responses:__
     *
     *      status (200) JSON Object: {"user":{object}}
     *      status (400, 500) JSON object: {error: 'Text about error'} or {error: object}
     *
     *
     * @method /:id
     * @for user
     * @memberOf user
     * @instance
     */
    router.get('/:id', handler.getOneUser); // getUserById route, currentUser route include( id == current),

    router.delete('/:id', handler.deleteUser)
    /**
     * __Type__ `DELETE`
     *
     * Base ___url___ for build __requests__ is `http:/localhost:port/user/:id`
     *
     *
     *
     * This __method__ delete one user by id.
     *
     *
     * * __Request:__
     *
     *   Params:
     *
     *   id - Object ID
     *
     *   if need current user
     *
     *
     *
     * ___`/user/560c099da5d4a2e20ba5068b`___
     *
     *
     *
     * __Responses:__
     *
     *      status (200) JSON Object: {"success": "User remove success"}
     *      status (400, 500) JSON object: {error: 'Text about error'} or {error: object}
     *
     *
     * @method /:id
     * @for user
     * @memberOf user
     * @instance
     */

    router.post('/', handler.createUser);
    router.patch('/:id', handler.updateUser);




    return router;
};
