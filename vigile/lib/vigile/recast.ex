defmodule Vigile.RecastAI do
  @moduledoc false

  @connect_url "https://api.recast.ai/connect/v1"
  @converse_url "https://api.recast.ai/v2/converse"

  @language Application.get_env(:vigile, :language)
  @token Application.get_env(:vigile, :recast_token)

  def converse_text(text, conversation_token \\ nil) do
    body = {:form,
      [{"text", text},
       {"language", @language},
       {"conversation_token", conversation_token}
      ]}

    with {:ok, %{body: body, status_code: 200}} <- HTTPoison.post(@converse_url, body, headers()),
         {:ok, %{"results" => results}} <- Poison.Parser.parse(body) do
      {:ok, results}
    else
      {:ok, %HTTPoison.Response{}} -> {:error, :auth_error}
      {:error, %HTTPoison.Error{}} -> {:error, :request_error}
      _ -> {:error, :parsing_error}
    end
  end

  def send_replies(messages, conversation_id) do
    route = "#{@connect_url}/conversations/#{conversation_id}/messages"

    with {:ok, messages} <- Poison.encode(messages),
         body <- {:form, [{"messages", messages}]},
         {:ok, %{status_code: 201}} <- HTTPoison.post(route, body, headers()) do
      {:ok, "Message sent with success"}
    else
      {:error, reason} -> {:error, reason}
      err -> {:error, err}
    end
  end

  # Helpers

  defp headers, do: [{"Authorization", "Token #{@token}"}]

end
