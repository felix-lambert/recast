defmodule Vigile.Checker do
  @moduledoc false

  require Logger
  alias Vigile.RecastAI

  def check_url(url, id) do
    case HTTPoison.get(url) do
      {:ok, %HTTPoison.Response{"status_code": code}} when code >= 200 and code <= 299 ->
        :ok
      {:ok, %HTTPoison.Response{"status_code": code, "body": body}} ->
        [%{type: "text", content: "Something went wrong while pinging #{url}"},
         %{type: "text", content: "Code: #{code}\nResult: #{body}"}]
        |> RecastAI.send_replies(id)
        :error
      err ->
        [%{type: "text", content: "Something went wrong while checking #{url}!"}]
        |> RecastAI.send_replies(id)
        :error
    end
  end
end
