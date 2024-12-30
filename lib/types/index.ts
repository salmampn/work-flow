export type IPermission = {
    id: string;
    created_at: string;
    role: "user" | "admin";
    status: "active" | "resigned";
    member_id: string;
    member: {
        id: string;
        created_at: string;
        name: string;
        email: string;
    }
}

export type ITeam = {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    created_by: string;
    member: {
        id: string;
        created_at: string;
        name: string;
        email: string;
    }
};

export type ITeamMember = {
    id: string;
    team_id: string;
    role: "leader" | "member";
    member_id: string;
    created_at: string;
    member: {
        id: string;
        created_at: string;
        name: string;
        email: string;
    };
    teams: {
        id: string;
        created_at: string;
        name: string;
        description: string | null;
    };
}

export type ITask = {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
    description: string | null;
    created_at: string;
    created_by: string;
    member: {
        id: string;
        created_at: string;
        name: string;
        email: string;
    }
};