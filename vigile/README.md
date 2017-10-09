# Vigile

**WORK IN PROGRESS**

Vigile is a smart chatbot. That means you can speak with him like you would speak to your grandma.
Here's an example: "Grandma, can you check if https://api.recast.ai is up and running every 5 minutes, and send me a fax if it's not? Please?"
The only difference is that Vigile knows how to make a HTTP request.

Made with :heart: using [Recast.AI](https://recast.ai)

## Usage

To run the bot, you need a config file. Copy paste this snippet in config/dev.exs, and change the **recast_token** by your own.
```ex
use Mix.Config

config :vigile,
  recast_token: "YOUR_DEVELOPER_RECAST_TOKEN",
  language: "en"
```
*NOTE: if you want your bot to be able to understand another language, you can change the language parameter. Don't forget to train your bot to understand it though.*

Now run the following commands to get your bot up and running.
```ex
$> mix deps.get
$> mix run --no-halt
```
