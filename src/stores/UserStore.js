const DataStore = require('./DataStore');
const User = require('../structures/User');

class UserStore extends DataStore {
  create(data) {
    super.create();
    if (this.has(data.id)) return this.get(data.id);
    const user = new User(this.client, data);
    this.set(user.id, user);
    return user;
  }

  remove(id) {
    super.remove();
    this.delete(id);
  }

  /**
   * Obtains a user from Discord, or the user cache if it's already available.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Snowflake} id ID of the user
   * @param {boolean} [cache=true] Whether to cache the new user object if it isn't already
   * @returns {Promise<User>}
   */
  fetch(id, cache = true) {
    if (this.has(id)) return Promise.resolve(this.get(id));
    return this.client.api.users(id).get().then(data =>
      cache ? this.create(data) : new User(this.client, data)
    );
  }
}

module.exports = UserStore;