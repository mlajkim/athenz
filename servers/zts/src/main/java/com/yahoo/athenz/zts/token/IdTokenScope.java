/*
 * Copyright The Athenz Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.yahoo.athenz.zts.token;

import com.yahoo.athenz.common.server.util.config.dynamic.DynamicConfigCsv;
import com.yahoo.athenz.zts.ZTSConsts;

import static com.yahoo.athenz.common.server.util.config.ConfigManagerSingleton.CONFIG_MANAGER;

public class IdTokenScope extends OAuthTokenScope {

    private static int maxDomains = Integer.parseInt(
            System.getProperty(ZTSConsts.ZTS_PROP_ID_TOKEN_MAX_DOMAINS, "10"));

    private static DynamicConfigCsv systemAllowedRoles = new DynamicConfigCsv(CONFIG_MANAGER,
            ZTSConsts.ZTS_PROD_ID_TOKEN_ALLOWED_ROLES, null);

    public static void setMaxDomains(int numDomains) {
        maxDomains = numDomains;
    }

    public IdTokenScope(final String scope) {

        // id token requests (service is required uri client_id parameter):
        //   openid
        //   openid [groups | roles]
        //   openid <domainName>:role.<roleName>
        //   openid <domainName>:group.<groupName>

        super(scope, maxDomains, systemAllowedRoles, null);

        // make sure openid scope is requested

        if (!openIdScope) {
            throw error("openid scope not specified", scope);
        }

        // if we have explicit group adn role name specified
        // then we'll assume that scope is enabled

        if (groupNames != null && !groupNames.isEmpty()) {
            groupsScope = true;
        }

        if (roleNames != null && !roleNames.isEmpty()) {
            rolesScope = true;
        }
    }
}
