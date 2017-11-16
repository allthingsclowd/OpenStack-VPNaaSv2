export class User {
    id: string;
    name: string;
    contract: string;
    contractId: string;
    region: string;
    token: string;
    globalToken: string;
    expires: string;
    catalog: catalog[];
    roles: roles[];
    projects: project[];
}

export class catalog {
    endpoints: endpoints[];
}

export class endpoints {
    id:string;
    interface: string;
    name: string;
    region: string;
    url: string;
}

export class roles {
    name: string;
    id: string;
}

export class projects {
    project: project[];
    length: number = projects.length;
}
export class project {
    id: string;
    name: string;
    description: string;
    contractid: string;
    enabled: boolean;
}

export class ProjectToken {
    projectId: string;
    scopedToken: string;
}