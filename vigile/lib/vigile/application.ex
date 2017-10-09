defmodule Vigile.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      Plug.Adapters.Cowboy.child_spec(:http, Vigile.Bot, [], port: 4242),
      worker(Vigile.Database, []),
    ]

    opts = [strategy: :one_for_one, name: Vigile.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
