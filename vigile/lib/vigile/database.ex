defmodule Vigile.Database do
  @moduledoc false

  use GenServer
  require Logger
  alias Vigile.Checker

  @name :database
  @interval Application.get_env(:vigile, :interval)

  # Database API

  def get_user_urls(id), do: GenServer.call(@name, {:lookup, id})

  def insert_url(id, url), do: GenServer.cast(@name, {:insert, id, url})

  def delete_url(id, url), do: GenServer.call(@name, {:delete, id, url})

  defp schedule_check(id, url) do
    #Process.send_after(self(), {:check, id, url}, @interval)
    Logger.info "Goin to check #{url}, #{id}"
    Process.send_after(self(), {:check, id, url}, 1_000)
  end

  # GenServer implementation

  def start_link do
    GenServer.start_link(__MODULE__, nil, name: @name)
  end

  def init(_state) do
    Logger.info "Database started"

    with {:ok, table} <- :dets.open_file(:users, [type: :bag]) do
      table
      |> :dets.match_object({:"$0", :"$1"})
      |> Enum.map(fn {i, u} -> schedule_check(i, u) end)

      {:ok, table}
    else
      err -> {:error, err}
    end
  end

  def handle_cast({:insert, id, url}, table) do
    :dets.insert(table, {id, url})
    schedule_check(id, url)
    {:noreply, table}
  end

  def handle_call({:lookup, id}, _from, table) do
    {:reply, :dets.lookup(table, id), table}
  end

  def handle_call({:delete, id, url}, _from, table) do
    case :dets.match(table, {id, url}) do
      [] ->
        {:reply, {:error, :not_found}, table}
      _res ->
        urls = table
        |> :dets.lookup(id)
        |> Enum.filter(fn {_i, u} -> u != url end)

        :dets.delete(table, id)
        :dets.insert(table, urls)
        {:reply, {:ok, urls}, table}
    end
  end

  def handle_info({:check, id, url}, table) do
    with urls <- :dets.lookup(table, id),
         {^id, ^url} <- Enum.find(urls, fn {i, u} -> i == id && u == url end) do
      Task.async(fn -> Checker.check_url(url, id) end)
      schedule_check(id, url)
    else
      _ -> Logger.info "Config has changed for #{url} for user #{id}. Monitoring stopped"
    end
    {:noreply, table}
  end

  def handle_info(_msg, table), do: {:noreply, table}

end
