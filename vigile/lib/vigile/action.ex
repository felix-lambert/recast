defmodule Vigile.Action do
  @moduledoc false

  @actions ~w(watch stop_watch list)

  require Logger
  alias Vigile.Database

  def handle_action({:ok, %{"replies" => replies} = result}) do
    action_slug = Kernel.get_in(result, ["action", "slug"])
    action_done = Kernel.get_in(result, ["action", "done"])

    case {action_slug, action_done, replies} do
      {slug, true, _r} when slug in @actions ->
        try do
          apply(__MODULE__, String.to_atom(slug), [result])
        rescue
          _ -> error_reply()
        end
      {_s, _d, [head | _tail]} -> [%{type: "text", content: head}]
      _ -> error_reply()
    end
  end
  def handle_action({:error, _err}), do: error_reply()

  # Actions

  def watch(%{"entities" => entities, "conversation_token" => id}) do
    url = get_url(entities)
    Database.insert_url(id, url)
    [%{type: "text", content: "I will watch #{url} for you."}]
  end

  def stop_watch(%{"entities" => entities, "conversation_token" => id}) do
    url = get_url(entities)
    case Database.delete_url(id, url) do
      {:error, :not_found} -> [%{type: "text", content: "You didn't ask me to watch #{url}"}]
      {:ok, _res} -> [%{type: "text", content: "I stopped watching #{url}"}]
    end
  end

  def list(%{"conversation_token" => id}) do
    urls = id
    |> Database.get_user_urls
    |> Enum.map(fn {_id, url} -> "- #{url}" end)
    |> Enum.join("\n")

    case urls do
      "" -> [%{type: "text", content: "I don't watch any url for you right now."}]
      urls -> [%{type: "text", content: "Here's the list of the urls I'm currently watching for you:\n#{urls}"}]
    end
  end

  # Helpers

  defp error_reply, do: [%{type: "text", content: "Something bad happened"}]
  defp get_url(%{"url" => [%{"raw" => url} | _tail]}), do: Regex.replace(~r/>\??$/, url, "")

end
