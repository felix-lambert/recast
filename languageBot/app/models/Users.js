db.createCollection('Users', {
  validator: { $or:
    [
      { senderId: { $type: 'number' } }
    ]
  }
})