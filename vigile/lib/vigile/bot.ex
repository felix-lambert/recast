defmodule Vigile.Bot do
  @moduledoc false

  use Plug.Router
  require Logger

  alias Vigile.{Action, RecastAI}

  plug :match
  plug Plug.Logger
  plug Plug.Parsers, parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  plug :dispatch

  def init(opts) do
    Logger.info "Bot started"
    opts
  end

  post "/" do
    message = Map.get(conn.body_params, "message")
    conversation_id = Map.get(message, "conversation")

    message
    |> Kernel.get_in(["attachment", "content"])
    |> RecastAI.converse_text(conversation_id)
    |> Action.handle_action()
    |> RecastAI.send_replies(conversation_id)

    send_resp(conn, 200, "Roger that")
  end

  get "/", do: send_resp(conn, 200, "Hi!")
  match _, do: send_resp(conn, 404, "Not found")

end
